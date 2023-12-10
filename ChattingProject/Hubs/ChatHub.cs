using ChattingProject.Contexts;
using ChattingProject.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChattingProject.Hubs
{
	public class ChatHub :Hub
	{
		private readonly ILogger<ChatHub> _logger;
		private readonly ChatDbContext _context;

		public ChatHub(ILogger<ChatHub> logger, ChatDbContext context)
        {
			_logger = logger;
			_context = context;
		}


		public async Task Send(string user , string message )
		{
			// Others => username and message appear to reciver
			
			 await Clients.Others.SendAsync("ReceiveMessage", user , message );
			Message msg = new Message()
			{
				MessageText = message,
				UserName = user
			};

			_context.Messages.Add(msg);
			await _context.SaveChangesAsync();
		}

		public async Task JoinGroup(string groupName, string userName)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
			await Clients.OthersInGroup(groupName).SendAsync("NewMemberJoin", userName, groupName);
			_logger.LogInformation(Context.ConnectionId);
			
		}

		public async Task SendMessageToGroup(string groupName, string user, string message)
		{
			// Others => username and message appear to reciver

			await Clients.Group(groupName).SendAsync("ReceiveMessageFromGroup", user, message);
			Message msg = new Message()
			{
				MessageText = message,
				UserName = user
			};

			_context.Messages.Add(msg);
			await _context.SaveChangesAsync();
		}


	}
}
