﻿namespace Shared.User
{
    public class NewUserRequest
    {
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Password { get; set; }
        public byte[] Salt { get; set; }
        public bool IsAdmin { get; set; }
    }
}
