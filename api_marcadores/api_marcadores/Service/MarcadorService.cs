using api_marcadores.Models;

using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace api_marcadores.Service
{
    public class MarcadorService
    {
            private static readonly HttpClient httpClient = new HttpClient();

        public static async Task<List<Marcador>> GetMarkers()
        {
            var token = await Authenticate();
            var markers = await FetchMarkers(token);
            return markers;
        }

        private static async Task<string> Authenticate()
        {
            var credentials = new
            {
                nombreUsuario = "cualquiervalor",
                password = "cualquiervalor"
            };

            var json = JsonConvert.SerializeObject(credentials);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync("https://prog3.nhorenstein.com/api/usuario/LoginUsuarioWeb", content);
            response.EnsureSuccessStatusCode();

            var authResult = await response.Content.ReadAsAsync<AuthResult>();
            return authResult.Token;
        }

        private static async Task<List<Marcador>> FetchMarkers(string token)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "https://prog3.nhorenstein.com/api/marcador/GetMarcadores");
            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Headers.Accept.Clear();
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            var marcadorResponse = JsonConvert.DeserializeObject<MarcadorResponse>(responseJson);

            //lleva este nombre ya que esta mal tipeado en el json
            return marcadorResponse.litadoMarcadores;
        }
    }

    public class MarcadorResponse
    {
        public List<Marcador> litadoMarcadores { get; set; }
    
    }
}

