
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mission
{
    public class Inventory
    {
        [Key]
        [DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }
        public DateTime AddedDate { get; set; } = DateTime.Now;
        public int AmoutProductQuantity { get; set; } = 0;

        internal static void Add(Inventory inv)
        {
            throw new NotImplementedException();
        }

        internal static object Find(Func<object, bool> p)
        {
            throw new NotImplementedException();
        }
    }
}
