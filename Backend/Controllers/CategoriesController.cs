using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryResponseDTO>>> GetAll()
    {
        return Ok(await categoryService.GetCategoriesAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryResponseDTO>> GetById(int id)
    {
        var category = await categoryService.GetCategoryAsync(id);
        return category is null ? NotFound() : Ok(category);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<CategoryResponseDTO>> Create([FromBody] CategoryCreateDTO dto)
    {
        var created = await categoryService.CreateCategoryAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
