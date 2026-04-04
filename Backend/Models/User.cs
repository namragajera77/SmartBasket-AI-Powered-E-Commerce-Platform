using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.Models;

public class User
{
	[field: CompilerGenerated]
		public int Id
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[Required]
	[MaxLength(100)]
	[field: CompilerGenerated]
		public string FirstName
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[Required]
	[MaxLength(100)]
	[field: CompilerGenerated]
		public string LastName
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[Required]
	[EmailAddress]
	[MaxLength(255)]
	[field: CompilerGenerated]
		public string Email
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[Required]
	[MaxLength(255)]
	[field: CompilerGenerated]
		public string PasswordHash
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[Required]
	[MaxLength(50)]
	[field: CompilerGenerated]
		public string Role
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = "Customer";

	[MaxLength(20)]
	[field: CompilerGenerated]
		public string? PhoneNumber
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public System.DateTime CreatedAtUtc
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = System.DateTime.UtcNow;

	[field: CompilerGenerated]
		public System.Collections.Generic.ICollection<CartItem> CartItems
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = (System.Collections.Generic.ICollection<CartItem>)new List<CartItem>();

	[field: CompilerGenerated]
		public System.Collections.Generic.ICollection<Order> OrdersPlaced
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = (System.Collections.Generic.ICollection<Order>)new List<Order>();

	[field: CompilerGenerated]
		public System.Collections.Generic.ICollection<Order> OrdersAssigned
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = (System.Collections.Generic.ICollection<Order>)new List<Order>();

	[field: CompilerGenerated]
		public System.Collections.Generic.ICollection<Review> Reviews
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = (System.Collections.Generic.ICollection<Review>)new List<Review>();

	[field: CompilerGenerated]
		public System.Collections.Generic.ICollection<RefreshToken> RefreshTokens
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = (System.Collections.Generic.ICollection<RefreshToken>)new List<RefreshToken>();
}

