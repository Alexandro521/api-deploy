const z = require("zod")

const movieSchema = z.object({
    title: z.string(),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(1.0),
    poster: z.string().url({
        message: 'poster must be a valid url'
    }),
    genre: z.array(z.enum(["Action","Adventure","Crime","Comedy","Drama","Fantasy","Horror","Triller","Sci-Fi"]),{
        required_error: "movie genre is required",
        invalid_type_error: "movie genre must be an array of enum genre"
    })
})

function validateMovie (object){
    return movieSchema.safeParse(object)
}
function validatePartialMovie(object){
  return  movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}