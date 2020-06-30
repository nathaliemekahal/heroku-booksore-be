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
      let filteredData=data.filter(comment=>comment.BookID===req.params.id)
     
      res.send(filteredData)
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

  commentsRouter.delete("/:id",async(req,res)=>{
    try {
      const data = await readDB(commentsJsonPath)
      const filteredData = data.filter(comment => comment.CommentID !== req.params.id)
      await writeDB(commentsJsonPath, filteredData)
      res.send("Deleted Sucessfully")
    } catch (error) {
      next(error)
    }
  })
  commentsRouter.put("/:id",async(req,res)=>{
    const comments = await readDB(commentsJsonPath)
    const comment = comments.find((b) => b.CommentID === req.params.id)
    try {
      if (comment) {
        const position = comments.indexOf(comment)
        const reviewUpdated = { ...comment, ...req.body } // In this way we can also implement the "patch" endpoint
        comments[position] = reviewUpdated
        await writeDB(commentsJsonPath, comments)
        res.status(200).send("Updated")
      } else {
        const error = new Error(`Comment with id ${req.params.id} not found`)
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
  })

  module.exports=commentsRouter