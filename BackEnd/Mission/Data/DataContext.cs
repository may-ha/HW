using Microsoft.EntityFrameworkCore;

namespace Mission.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        
            public DbSet<User> users { get; set; }
            public DbSet<Product> products { get; set; }
            public DbSet<Inventory> inventory { get; set; }


            
        
    }
}
