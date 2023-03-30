const db = require("../../models");
const University = db.University;
const Campus = db.Campus;
const Activity = db.Activity;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const mysqldump = require("mysqldump");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "../../../../../config/config.json")[env];

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const getFileName = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const timestamp = date.getTime();
  const fileName = year + "_" + month + "_" + day + "_file_" + timestamp;
  console.log("Unique file name: " + fileName);
  return fileName;
};

const getTimeFromFileName = async (fileName) => {
  const [dateString, timestampString] = fileName.split("_file_");
  const [year, month, day] = dateString.split("_").map(Number);
  const timestamp = Number(timestampString.split(".")[0]);
  const date = new Date(timestamp);
  return date.toString();
};

const getBackupFiles = async () => {
  const backupDirectory = "./backups/";
  const files = await fs.promises.readdir(backupDirectory);
  const backups = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(backupDirectory, file);
      const stats = await fs.promises.stat(filePath);
      if (path.extname(file) === ".sql") {
        let time = await getTimeFromFileName(file);
        console.log("time", file, time);
        return {
          time,
          size:
            stats.size / 1024 > 1200
              ? (stats.size / (1024 * 1024)).toFixed(2) + " MB"
              : (stats.size / 1024).toFixed(2) + " KB",
          file,
        };
      }
    })
  );
  // const backups = files.map(async (file) => {
  //   console.log("these are backup filessssss", file.size);
  //   if (path.extname(file) === ".sql") {
  //     let time = await getTimeFromFileName(file);
  //     console.log("time", file, time);
  //     return { time, file };
  //   }
  // });
  console.log("backups", backups);
  return await Promise.all(backups);
};

exports.download = async (req, res, next) => {
  try {
    const file = path.join(
      __dirname,
      `../../../../backups/${req.params.fileName}.sql`
    );
    console.log("fileeeeeee", file);
    return res.download(file);
  } catch (err) {
    console.log("Error handling =>", err);
    next();
  }
};

// create university
exports.create = async (req, res, next) => {
  console.log("Creaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaate");
  try {
    const options = {
      host: config.host,
      user: config.username,
      password: config.password,
      database: config.database,
      password: config.password,
      // databsase: "Qetc",
      // dest: __dirname + "../../../../../config"
    };

    var d = new Date();
    var filename =
      +d.getDate() +
      "-" +
      d.getDate() +
      "-" +
      d.getMonth() +
      "-" +
      d.getFullYear();
    console.log("options", options);
    if (!fs.existsSync("./backups/")) fs.mkdirSync("./backups/");
    let fileName = await getFileName();
    console.log("config from backup.controller", config);
    mysqldump({
      connection: options,
      dumpToFile: `./backups/${fileName}.sql`,
    });

    // console.log("options",result)
    // await Activity.create({ action: "Backup created", name: req.body.Uname, role: req.body.role });

    return res.send({
      success: true,
      message: "backups created successfully",
    });
  } catch (err) {
    console.log("Error handling =>", err);
    next();
  }
};

exports.list = async (req, res, next) => {
  // console.log("req.query",req.query);
  try {
    const backups = await getBackupFiles();
    return res.send({
      success: true,
      backups,
      message: "Backups fetched successfully",
    });
  } catch (err) {
    res.send("Backups Error " + err);
  }
};

exports.restore = async (req, res, next) => {
  const restoreCommand = `mysql -u ${config.username} -p ${config.password} ${config.database} < ./backups/${req.params.fileName}.sql`;
  child_process.exec(restoreCommand, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Failed to restore database", success: true });
    }
    return res
      .status(200)
      .json({ message: "Database restored successfully", success: false });
  });
};

exports.delete = async (req, res, next) => {
  try {
    const filePath = `./backups/${req.params.fileName}.sql`;
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete file" });
      }
      return res
        .status(200)
        .json({ message: "File deleted successfully", success: true });
    });
  } catch (error) {
    return next(error);
  }
};
