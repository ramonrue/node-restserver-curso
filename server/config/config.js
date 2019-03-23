
//************/
//PUERTO******/
//************/

process.env.PORT=process.env.PORT || 3000;

//************/
//ENTORNO******/
//************/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//************/
//VENCIMIENTO DEL TOKEN******/
//60 segundos************/
//60 minutos ************/
//24 horas************/
//30 dias************/
process.env.CADUCIDAD_TOKEN='48h';


//************/
//SEED TOKEN******/
//************/
process.env.SEED=process.env.SEED || 'este-es-el-seed-de-desarrollo';

//************/
//BASE DE DATOS******/
//************/
let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB='mongodb://localhost:27017/cafe';
} else {
    urlDB=process.env.MONGO_URI;
}
process.env.URLDB=urlDB;

//************/
//GOOGLE CLIENT******/
//************/
process.env.CLIENT_ID=process.env.CLIENT_ID || '369966208849-p0m5v417lphu4jar6hu6m9p2okha3sbg.apps.googleusercontent.com';




