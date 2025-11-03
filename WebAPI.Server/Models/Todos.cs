namespace WebAPI.server.Models
{
    public class Todo
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public bool IsDone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? Deadline { get; set; }
    }
}
