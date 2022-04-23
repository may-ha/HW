using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Mission.Data;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace Mission.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MissionController : Controller
    {


        private readonly DataContext _context;
        public MissionController(DataContext context)
        {
            _context = context;

        }
        [Route("Getusers")]
        [HttpGet]
        public async Task<ActionResult<List<User>>> Getusers()
        {
            try
            {
                return Ok(await _context.users.ToListAsync());
            }catch(Exception ex)
            {
                return Ok(new List<User>());
            }

        }
        [Route("Getproduct")]
        [HttpGet]
        public async Task<ActionResult<List<Product>>> Getproduct()
        {
            return Ok(await _context.products.ToListAsync());

        }
        [Route("Getinventory")]
        [HttpGet]

        public async Task<ActionResult<List<Inventory>>> Getinventory()
        {
            return Ok(await _context.inventory.ToListAsync());

        }


        [Route("GetuserbyID")]
        [HttpGet]

        public async Task<ActionResult<User>> GetuserbyID(int id)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
                return BadRequest("user not found");
            return Ok(user);

        }

        [Route("GetproductbyID")]
        [HttpGet]
        public async Task<ActionResult<Product>> GetproductbyID(int id)
        {
            var product = await _context.products.FindAsync(id);
            if (product == null)
                return BadRequest("user not found");
            return Ok(product);

        }
        [Route("GetInventory")]
        [HttpGet]

        public async Task<ActionResult<Inventory>> GetInventory(int id)
        {
            var inventory = await _context.inventory.FindAsync(id);
            if (inventory == null)
                return BadRequest("user not found");
            return Ok(inventory);

        }
        [Route("Adduser")]
        [HttpPost]
        public async Task<ActionResult<List<User>>> Adduser(User user)
        {
            try
            {
                user.Id = null;
                _context.users.Add(user);
                await _context.SaveChangesAsync();
               // var id = user.Id;
                return Ok(await _context.users.ToListAsync());
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        [Route("Addproduct")]
        [HttpPost]

        public async Task<ActionResult<List<Product>>> Addproduct(Product product)
        {
            _context.products.Add(product);
            await _context.SaveChangesAsync();
            return Ok(await _context.products.ToListAsync());

        }

        [Route("Addinventory")]
        [HttpPost]
        public async Task<ActionResult<List<Inventory>>> Addinventory(Inventory inv)
        {
            _context.inventory.Add(inv);
            await _context.SaveChangesAsync();
            return Ok(await _context.inventory.ToListAsync());

        }
        [Route("updateUser")]
        [HttpPut]
        public async Task<ActionResult<List<User>>> updateUser(User requeset)
        {
            var dbUser = await _context.users.FindAsync(requeset.Id);
            if (dbUser == null)
                return BadRequest("user not found");

            dbUser.Name = requeset.Name;
            dbUser.Username = requeset.Username;
           // dbUser.Password = requeset.Password;

            await _context.SaveChangesAsync();
            return Ok(await _context.users.ToListAsync());
        }

        [Route("updateProduct")]
        [HttpPut]
        public async Task<ActionResult<List<Product>>> updateProduct(Product requeset)
        {
            var product = await _context.products.FindAsync(requeset.Id);
            return BadRequest("user not found");

            product.Name = requeset.Name;
            product.Code = requeset.Code;
            product.Date = requeset.Date;
            await _context.SaveChangesAsync();
            return Ok(await _context.products.ToListAsync());
        }

        [Route("updateinventory")]
        [HttpPut]
        public async Task<ActionResult<List<Inventory>>> updateinventory(Inventory requeset)
        {
            var invs = await _context.inventory.FindAsync(requeset.Id);
            return BadRequest("user not found");
            await _context.SaveChangesAsync();
            return Ok(await _context.inventory.ToListAsync());
        }




        [Route("DeleteUser")]
        [HttpDelete]
        public async Task<ActionResult<List<User>>> DeleteUser(int id)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
                return BadRequest("user not found");
            _context.users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(await _context.users.ToListAsync());

        }

        [Route("DeleteProduct")]
        [HttpDelete]
        public async Task<ActionResult<List<Product>>> DeleteProduct(int code)
        {
            var product = await _context.products.FindAsync(code);
            return BadRequest("user not found");
            _context.products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(await _context.products.ToListAsync());
        }
        [Route("DeleteInventory")]
        [HttpDelete]
        public async Task<ActionResult<List<Inventory>>> DeleteInventory(int id)
        {
            var inventory = await _context.inventory.FindAsync(id);
            return BadRequest("inventory not found");
            _context.inventory.Remove(inventory);
            return Ok(await _context.inventory.ToListAsync());

        }




    }
}
