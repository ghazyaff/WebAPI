using Microsoft.EntityFrameworkCore;
using WebAPI.server.Models;

namespace WebAPI.server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Todo> Todos => Set<Todo>();
    }
}
