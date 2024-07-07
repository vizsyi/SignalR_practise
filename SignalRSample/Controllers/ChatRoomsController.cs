using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Data;
using SignalRSample.Models.Chat;

namespace SignalRSample.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class ChatRoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatRoomsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ChatRooms
        [HttpGet]
        [Route("/[controller]/GetChatRooms")]
        public async Task<ActionResult<IEnumerable<ChatRoom>>> GetChatRoom()
        {
            return await _context.ChatRoom.ToListAsync();
        }

        [HttpGet]
        [Route("/[controller]/GetChatUsers")]
        public async Task<ActionResult<IEnumerable<Object>>> GetChatUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            //var users = await _context.Set<IdentityUser>().ToListAsync();
            var users = await _context.Users.ToListAsync();

            if (users == null)
            {
                return NotFound();
            }

            return users.Where(u => u.Id != userId)
                .Select(u => new {u.Id, u.UserName}).ToList();
        }

        // POST: api/ChatRooms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("/[controller]/PostChatRoom")]
        public async Task<ActionResult<ChatRoom>> PostChatRoom(ChatRoom chatRoom)
        {
            if(chatRoom == null)
            {
                return NotFound();
            }
            
            _context.ChatRoom.Add(chatRoom);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChatRoom", new { id = chatRoom.Id }, chatRoom);
        }

        // DELETE: api/ChatRooms/5
        [HttpDelete("{id}")]
        [Route("/[controller]/DeleteChatRoom/{id}")]
        public async Task<IActionResult> DeleteChatRoom(int id)
        {
            var chatRoom = await _context.ChatRoom.FindAsync(id);
            if (chatRoom == null)
            {
                return NotFound();
            }

            _context.ChatRoom.Remove(chatRoom);
            await _context.SaveChangesAsync();

            var room = await _context.ChatRoom.FirstOrDefaultAsync();

            return Ok(new {deleted = id, selected = (room == null ? 0 : room.Id)});
        }

    }
}
