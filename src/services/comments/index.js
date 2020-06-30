const express = require("express")
const path = require("path")
const { check, validationResult, sanitizeBody } = require("express-validator")
const fs = require("fs-extra")

const { join } = require("path")
const { readDB, writeDB } = require("../../utilities")


const commentsJsonPath = path.join(__dirname, "comments.json")

const commentsRouter=express.Router()

commentsRouter.get("/:id", async (req, res, next) => {
    try {
      const data = await readDB(commentsJsonPath)
  
      res.send(data)
    } catch (error) {
      console.log(error)
      const err = new Error("While reading Comments list a problem occurred!")
      next(err)
    }
  })

  module.exports=commentsRouter