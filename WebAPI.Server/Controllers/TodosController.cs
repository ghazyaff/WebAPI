using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.server.Data;
using WebAPI.server.Models;

namespace WebAPI.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodosController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TodosController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetAll()
        {
            return await _db.Todos.OrderByDescending(t => t.CreatedAt).ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Todo>> Get(int id)
        {
            var item = await _db.Todos.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<Todo>> Create(Todo todo)
        {
            _db.Todos.Add(todo);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = todo.Id }, todo);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Todo todo)
        {
            if (id != todo.Id) return BadRequest();
            var exists = await _db.Todos.AnyAsync(t => t.Id == id);
            if (!exists) return NotFound();

            _db.Entry(todo).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var todo = await _db.Todos.FindAsync(id);
            if (todo == null) return NotFound();
            _db.Todos.Remove(todo);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("count")]
        public async Task<ActionResult<int>> GetCount()
        {
            var count = await _db.Todos.CountAsync();
            return Ok(count);
        }
    }
}
