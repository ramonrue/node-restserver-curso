



const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario=require('../models/usuario');
const Producto=require('../models/producto');

const fs=require('fs');
const path=require('path');

// default options
app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', function(req, res) {


  let tipo=req.params.tipo;
  let id=req.params.id;


  if (Object.keys(req.files).length == 0) {
    return res.status(400).json({
        ok:false,
        err:{
            messagr:'No se han seleccionado archivos'
        }
    })
  }
  //Valida tipos
  let tiposValidos=['productos','usuarios'];
  if (tiposValidos.indexOf(tipo)<0){
    return res.status(400).json({
      ok:false,
      message:'los tipos permitidos son ' + tiposValidos.join(',')      
  });
  }

  // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  //extensiones permitidas
  let extensionesValidas=['png','jpg','gif','jpeg','bmp'];
  
  let nombreCortado=archivo.name.split('.');
  let extension=nombreCortado[nombreCortado.length-1];

  if (extensionesValidas.indexOf(extension)<0) {
      return res.status(400).json({
          ok:false,
          message:'las extensiones permitidas son ' + extensionesValidas.join(','),
          ext:extension
      });
  };

  //Cambiar el nombre al archivo
  let nombreArchivo=`${id}-${new Date().getMilliseconds()}.${extension}`
  
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err)=> {
    if (err)
      return res.status(500).json({
          ok:false,
          err
      })

      if (tipo==='usuarios') {
        imagenUsuario(id,res,nombreArchivo);
      }else {
        if (tipo==='productos'){
          imagenProducto(id,res,nombreArchivo);
          };
      }
        
      

  });
});

function imagenUsuario(id,res,nombreArchivo){
  Usuario.findById(id,(err,usuarioDB)=>{
    if (err) {
      borraArchivo(nombreArchivo,'usuarios');
      return res.status(500).json({
        ok:false,
        err
      });
    }

    if (!usuarioDB){
      borraArchivo(nombreArchivo,'usuarios');
      return res.status(400).json({
        ok:false,
        err:{
          message:'El usuario no existe'
        }
      });
    }

    // let pathImagen =path.resolve(__dirname,`../../uploads/usuarios/${ usuarioDB.img }`);
    // if (fs.existsSync(pathImagen)){
    //   fs.unlinkSync(pathImagen);
    // }

    borraArchivo(usuarioDB.img,'usuarios');


    usuarioDB.img=nombreArchivo;

    usuarioDB.save((err,usuarioGuardado)=>{
          res.json({
            ok:true,
            usuario:usuarioGuardado,
            img:nombreArchivo
          });
    });

  });
};

function imagenProducto(id,res,nombreArchivo){

  console.log(id);

  Producto.findById(id,(err,productoDB)=>{
    if (err) {
      borraArchivo(nombreArchivo,'productos');
      return res.status(500).json({
        ok:false,
        err
      });
    }
    
    if (!productoDB){
      borraArchivo(nombreArchivo,'productos');
      return res.status(400).json({
        ok:false,
        err:{
          message:'El producto no existe'
        }
      });
    }

    // let pathImagen =path.resolve(__dirname,`../../uploads/usuarios/${ usuarioDB.img }`);
    // if (fs.existsSync(pathImagen)){
    //   fs.unlinkSync(pathImagen);
    // }

    console.log(productoDB.img);
    borraArchivo(productoDB.img,'productos');


    productoDB.img=nombreArchivo;

    productoDB.save((err,productoGuardado)=>{
          res.json({
            ok:true,
            producto:productoGuardado,
            img:nombreArchivo
          });
    });

  });
};


function borraArchivo(nombreImagen,tipo){
  let pathImagen =path.resolve(__dirname,`../../uploads/${ tipo }/${ nombreImagen }`);
  if (fs.existsSync(pathImagen)){
    fs.unlinkSync(pathImagen);
  }
};


module.exports=app;
