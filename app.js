const express = require('express')
const movies = require('./movies.json')
const crypto = require("node:crypto")
const {validateMovie, validatePartialMovie} = require("./Schemes/movies")

const app = express();
app.use(express.json())
app.disable('x-powered-by') //deshabilitar header


app.get('/movies',(req,res)=>{
    res.json(movies)
})

app.get('/movies/:id',(req,res)=>{
    const id = req.params.id
    const movie = movies.find(movie => movie.id === id)
    if(movie)return res.json(movie)
    res.status(404).json({message: "Movie not found"})
})

app.get("/movies/",(req,res)=>{
    const {genres} = req.query;
    if(genre){
        const filterMovies= movies.filter(
            movie => movie.genre.toLowerCase() === genres.toLowerCase()
        )
        return res.json(filterMovies)
    }
})

app.post("/movies",(req,res)=>{

    const result = validateMovie(req.body) //funcion que valida la cabezera
    //verifica si todo esta bien
    if(result.error){
        //si hubo un error retorna el req.body con el error
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    //si todo sale bien devuelve esto
    const newMovie ={
        id: crypto.randomUUID(),
        ...result.data
    }
    //lo agrega al DB
    movies.push(newMovie)
    //repuesta
    res.status(201).json(newMovie)
})

app.patch("/movies/:id",(req,res)=>{

    const result = validatePartialMovie(req.body)//valida el cuerpo de la solicitud y si es valida pasa

    if(result.error){// si el curpo de la repuesta no es valido y hay un error retornamos lo siguiente
        return  res.status(400).json({error: JSON.parse(result.error.message)})//un obj json con el error
    }

    const id = req.params.id;//obtener el id del params

    const movieIndex = movies.findIndex(movie => movie.id === id);//busca el id de la pelicula en el array comparando con el id del params

    if(movieIndex === -1){//si el tamaño del movieIndex es 0 significa que la peli no existe,retona 404
       return  res.status(404).json({message: 'Movie not found'})
    }

    //? si todo sale correcto 
    const updateMovie = {
        ...movies[movieIndex],//obten el elemento original
       ...result.data,//obten los datos a actualizar
    }

    movies[movieIndex] = updateMovie//actualiza el objeto

    return res.json(updateMovie)

})



//! CORS solucinando problema de CORS
app.options("/movies/:id",(req,res)=>{
    const origin = req.header("origin")

    res.header("Access-Control-Allow-Origin",origin)
    res.header('Access-Control-Allow-Methods',"GET, POST, PATCH, DELETE")
    res.send(200)
})

const PORT = process.env.PORT ?? 3000;

app.listen(PORT,()=>{
    console.log("servidor escuchando en el port http://localhost:3000")
})