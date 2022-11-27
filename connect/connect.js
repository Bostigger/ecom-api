const mongoose  = require('mongoose')

const ConnectDb = (url) => {
  return mongoose.connect(url).then(()=>{

  }).catch((e)=>{
      console.log(e)
  })
}

module.exports = ConnectDb