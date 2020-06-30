const express = require("express")
const path = require("path")
const { check, validationResult, sanitizeBody } = require("express-validator")
const fs = require("fs-extra")
const uniqid=require("uniqid")
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

  commentsRouter.post(
    "/",
  
    async (req, res, next) => {

    //   if (!errors.isEmpty()) {
    //     const error = new Error()
    //     error.httpStatusCode = 400
    //     error.message = errors
    //     next(error)
    //   }
      try {
        const commentsArray = await readDB(commentsJsonPath)
        const addedComment={CommentID:uniqid(),...req.body,createdAt:new Date()}
        commentsArray.push(addedComment)
          await writeDB(commentsJsonPath, commentsArray)
          res.status(201).send("Created")
    
      } catch (error) {
        next(error)
      }
    }
  )

  module.exports=commentsRouter