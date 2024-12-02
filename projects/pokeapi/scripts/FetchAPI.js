"use strict";

/**
 * Clase FetchAPI para realizar solicitudes HTTP de manera sencilla y estructurada.
 * Utiliza la API Fetch de JavaScript y permite configurar opciones predeterminadas, manejar errores y definir un tiempo de espera (timeout).
 **/
class FetchAPI {
  /**
   * Crea una instancia de FetchAPI.
   *
   * @param {string} [baseURL=""] - La URL base para las solicitudes.
   * @param {object} [defaultOptions={}] - Opciones predeterminadas para las solicitudes, como headers.
   */
  constructor(baseURL = "", defaultOptions = {}) {
    this.baseURL = baseURL; // URL base para las solicitudes.
    this.defaultOptions = defaultOptions; // Opciones predeterminadas (ej. headers).
  }

  /**
   * Realiza una solicitud HTTP genérica utilizando fetch.
   *
   * @param {string} endpoint - La ruta del recurso a solicitar.
   * @param {object} [options={}] - Opciones adicionales para la solicitud (método, headers, body).
   * @param {number} [timeout=30000] - Tiempo máximo en milisegundos para esperar la respuesta antes de abortar la solicitud.
   * @param {function} [callback] - Función callback que recibe el resultado (o el error) cuando la solicitud finaliza.
   * @returns {Promise} - Devuelve una promesa con la respuesta procesada (JSON, texto, binario).
   */
  async request(endpoint, options = {}, timeout = 30000, callback, fullURL = null) {
    const controller = new AbortController(); // Controlador para abortar la solicitud en caso de timeout.
    const signal = controller.signal;

    // Configuración del timeout para abortar la solicitud si se excede el tiempo especificado.
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = fullURL || this.baseURL + endpoint;

      // Realizamos la solicitud con fetch.
      const response = await fetch(url, {
        ...this.defaultOptions,
        ...options,
        signal,
      });

      // Verificamos si la respuesta es exitosa (código 2xx).
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} ${response.statusText}`
        );
      }

      // Procesamos la respuesta según el tipo de contenido.
      const contentType = response.headers.get("Content-Type") || "";
      let result;
      if (contentType.includes("application/json")) {
        result = await response.json(); // Si es JSON, lo retornamos como objeto.
      } else if (contentType.includes("text")) {
        result = await response.text(); // Si es texto, lo retornamos como string.
      } else if (contentType.includes("image")) {
        result = await response.blob(); // Si es imagen o binario, lo retornamos como Blob.
      } else {
        result = await response.text(); // Si no se reconoce el tipo, lo tratamos como texto.
      }

      // Si se define un callback, lo llamamos con el resultado.
      if (callback) {
        callback(result, null); // Primer argumento: resultado, segundo: error (null porque fue exitoso).
      }

      return result;
    } catch (error) {
      // Si la solicitud es abortada por timeout, lanzamos un error específico.
      if (error.name === "AbortError") {
        error.message = "La solicitud fue cancelada por timeout";
      }

      // Si se define un callback, lo llamamos con el error.
      if (callback) {
        callback(null, error); // Primer argumento: resultado (null porque falló), segundo: error.
      }

      throw error; // Lanza el error para quienes usen promesas.
    } finally {
      clearTimeout(timeoutId); // Limpiamos el timeout después de realizar la solicitud.
    }
  }

  /**
   * Realiza una solicitud GET.
   *
   * @param {string} endpoint - La ruta del recurso a solicitar.
   * @param {number} [timeout=30000] - Tiempo máximo en milisegundos para esperar la respuesta antes de abortar la solicitud.
   * @param {function} [callback] - Función callback que recibe el resultado (o el error) cuando la solicitud finaliza.
   * @param {string} fullURL - La URL completa del recurso.
   * @returns {Promise} - Devuelve una promesa con la respuesta procesada.
   */
  get(endpoint, timeout = 30000, callback, fullURL = null) {
    return this.request(endpoint, { method: "GET" }, timeout, callback, fullURL);
  }

  /**
   * Realiza una solicitud POST con un cuerpo JSON.
   *
   * @param {string} endpoint - La ruta del recurso a solicitar.
   * @param {object} body - El cuerpo de la solicitud que se enviará como JSON.
   * @param {number} [timeout=30000] - Tiempo máximo en milisegundos para esperar la respuesta antes de abortar la solicitud.
   * @param {function} [callback] - Función callback que recibe el resultado (o el error) cuando la solicitud finaliza.
   * @param {string} fullURL - La URL completa del recurso.
   * @returns {Promise} - Devuelve una promesa con la respuesta procesada.
   */
  post(endpoint, body, timeout = 30000, callback, fullURL = null) {
    return this.request(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      timeout,
      callback,
      fullURL
    );
  }

  /**
   * Realiza una solicitud PUT con un cuerpo JSON.
   *
   * @param {string} endpoint - La ruta del recurso a solicitar.
   * @param {object} body - El cuerpo de la solicitud que se enviará como JSON.
   * @param {number} [timeout=30000] - Tiempo máximo en milisegundos para esperar la respuesta antes de abortar la solicitud.
   * @param {function} [callback] - Función callback que recibe el resultado (o el error) cuando la solicitud finaliza.
   * @param {string} fullURL - La URL completa del recurso.
   * @returns {Promise} - Devuelve una promesa con la respuesta procesada.
   */
  put(endpoint, body, timeout = 30000, callback, fullURL = null) {
    return this.request(
      endpoint,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      timeout,
      callback,
      fullURL
    );
  }

  /**
   * Realiza una solicitud DELETE.
   *
   * @param {string} endpoint - La ruta del recurso a solicitar.
   * @param {number} [timeout=30000] - Tiempo máximo en milisegundos para esperar la respuesta antes de abortar la solicitud.
   * @param {function} [callback] - Función callback que recibe el resultado (o el error) cuando la solicitud finaliza.
   * @param {string} fullURL - La URL completa del recurso.
   * @returns {Promise} - Devuelve una promesa con la respuesta procesada.
   */
  delete(endpoint, timeout = 30000, callback, fullURL = null) {
    return this.request(endpoint, { method: "DELETE" }, timeout, callback, fullURL);
  }
}
