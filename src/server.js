const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const helmet = require("helmet")


const booksRouter = require("./services/books")
const commentsRouter=require("./services/comments")
const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers")

const server = express()

const port = process.env.PORT

// MIDDLEWARES
const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
server.use(express.json())

// const whitelist =
//   process.env.NODE_ENV === "production"
//     ? [process.env.FE_URL]
//     : ["http://localhost:3007", "http://localhost:3002"]

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
// }

server.use(cors())

server.use(helmet())

//ROUTES
server.use("/books", booksRouter)
server.use("/comments",commentsRouter)

// ERROR HANDLERS
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

server.listen(port, () => {
  console.log("Running on port", port)
})
