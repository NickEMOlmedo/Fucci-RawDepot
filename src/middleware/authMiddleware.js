import { Router } from "express";
import { PrismaClient } from "@prisma/client/extension";
import { compareSync, hashSync } from "bcryptjs";

const router = Router();
const prisma = new PrismaClient()

// Verificar si el empleado existe y si no proceder a crearlo.

export const authSingup = async (req, res) => {

    const { nombre, apellido, dni, contrasena, area, rol } = req.body;

    let empleado = await prisma.empleado.findFirst({ where: { dni } });

    if (empleado) {

        throw new Error("¡El empleado ya existe!");

    }

    empleado = await prisma.empleado.create({

        data: {
            nombre,
            apellido,
            dni,
            contrasena: hashSync(password, 10),
            area,
            rol
        }
    });

    res.json(empleado);
}

//Verificar si el empleado existe y realiza la comprobacion para ejecutar el login;

export const login = async (req, res) => {

    const { dni, contrasena } = req.body;

    let empleado = await prisma.empleado.findFirst({ where: { dni } });

    if (!empleado) {

        throw new Error("¡El empleado no existe!");

    }

    if (!compareSync(contrasena, empleado.contrasena)) {

        throw new Error("¡Contraseña incorrecta!");

    }

    const token = jwt.sign({



        
    })

    res.json(empleado);

}