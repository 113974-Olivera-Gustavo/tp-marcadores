using api_marcadores.Models;
using api_marcadores.Service;
using Microsoft.AspNetCore.Mvc;

namespace api_marcadores.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MarcadorController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Marcador>>> Get()
        {
            try
            {
                var markers = await MarcadorService.GetMarkers();
                return markers;
            }
            catch (Exception ex)
            {
                // Manejar cualquier error y devolver una respuesta adecuada
                return StatusCode(500, $"Se produjo un error al obtener los marcadores: {ex.Message}");
            }
        }
    }
}
