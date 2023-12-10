using ChattingProject.Models;
using Microsoft.EntityFrameworkCore;

namespace ChattingProject.Contexts
{
	public class ChatDbContext :DbContext
	{
        public ChatDbContext(DbContextOptions<ChatDbContext> options):base(options)
        {
            
        }
        public DbSet<Message> Messages { get; set; }


    }
}
