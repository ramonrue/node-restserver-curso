
const jwt=require('jsonwebtoken');

//
//verificar token
//

let verificaToken=( req,res,next )=>{
    //Para leer el header:
    let token=req.get('token');
    jwt.verify(token,process.env.SEED,(err,decoded)=>{

        if (err) {
            return res.status(401).json({
                ok:false,
                err:{
                    message:"Token no válido"
                }
            });
        }

        req.usuario=decoded.usuario;
        next();

    });
    
    console.log(token);



    

};

//
//verificar AdminRole
//
let verificaAdmin_Role=(req,res,next)=>{
    let usuario=req.usuario;
    console.log(usuario.rol);
    if (usuario.role==='ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        })
    }
}


module.exports = {
    verificaToken,
    verificaAdmin_Role
}
