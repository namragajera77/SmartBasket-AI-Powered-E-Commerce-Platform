using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductService productService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<ProductResponseDTO>>> GetProducts([FromQuery] ProductQueryParametersDTO query)
    {
        return Ok(await productService.GetProductsAsync(query));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponseDTO>> GetProduct(int id)
    {
        var product = await productService.GetProductAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ProductResponseDTO>> CreateProduct([FromBody] ProductCreateDTO dto)
    {
        var created = await productService.CreateProductAsync(dto);
        return CreatedAtAction(nameof(GetProduct), new { id = created.Id }, created);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDTO dto)
    {
        await productService.UpdateProductAsync(id, dto);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        await productService.DeleteProductAsync(id);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("upload-image")]
    public async Task<ActionResult<string>> UploadImage([FromForm] IFormFile imageFile)
    {
        var url = await productService.UploadProductImageAsync(imageFile);
        return Ok(url);
    }
}
