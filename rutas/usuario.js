var ruta=require("express").Router();
var {Usuario}=require("../conexion");

ruta.get("/login",(req,res)=>{
    res.render("login");
});

ruta.post("/login",(req,res)=>{
    console.log(req.body);
    Usuario.findAll({where:{usuario:req.body.usuario,password:req.body.password}})
    .then((usuario)=>{
        if(usuario!=""){
            req.session.usuario=usuario[0].nombre;
            res.redirect("/bienvenido");
        }
        else{
            res.redirect("/login");
        }
        
    })
    .catch((err)=>{
        console.log("Error en login ........ "+err);
        res.redirect("/");
    });
});

ruta.get("/bienvenido",(req,res)=>{
    console.log(req.session.usuario);
    if(req.session.usuario==undefined || req.session.usuario=="" || req.session.usuario==null){
        res.redirect("login");
    }
    else{
        res.render("bienvenido",{usuario:req.session.usuario});
    }
});

ruta.get("/logout",(req,res)=>{
    req.session=null;
    res.redirect("/")
});

ruta.get("/",(req,res)=>{
    Usuario.findAll({where:{status:1}})
    .then((usu)=>{
        //console.log(usu);
        res.render("mostrarUsuario",{Usuarios:usu});
    })
    .catch((err)=>{
        console.log("Error .................."+err)
        res.render("mostrarUsuario");
    });
});

ruta.get("/nuevoUsuario",(req, res)=>{
    res.render("nuevoUsuario");
});

ruta.post("/nuevoUsuario",(req,res)=>{
    console.log(req.body);
    Usuario.create(req.body)
    .then(()=>{
        res.redirect("/")
    })
    .catch((err)=>{
        console.log("error "+err);
        res.redirect("/");
    });
});

ruta.get("/editarUsuario/:id",(req, res)=>{
    Usuario.findByPk(req.params.id)
    .then((usuario)=>{
        res.render("modificarUsuario",{usuario:usuario});
    })
    .catch((err)=>{
        console.log("Error ........... "+err);
        res.redirect("/");
    });
});

ruta.post("/modificarUsuario",(req,res)=>{
    Usuario.update(req.body,{where:{id:req.body.id}})
    .then(()=>{
        res.redirect("/");
    })
    .catch((err)=>{
        console.log("Error ................. "+err);
        res.redirect("/");
    });
});

ruta.get("/borradoFisico/:id",(req,res)=>{
    Usuario.destroy({where:{id:req.params.id}})
    .then(()=>{
        res.redirect("/");
    })
    .catch((err)=>{
        console.log("Error .............. "+err);
        res.redirect("/");
    });
});

ruta.get("/borradoLogico/:id",(req,res)=>{
    Usuario.update({status:0},{where:{id:req.params.id}})
    .then(()=>{
        res.redirect("/")
    })
    .catch((err)=>{
        console.log("Error ................. "+err);
        res.redirect("/");
    });
});

module.exports=ruta;