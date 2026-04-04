using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.Models;

public class Order
{
	[field: CompilerGenerated]
		public int Id
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public int UserId
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public int? DeliveryBoyId
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[MaxLength(10)]
	[field: CompilerGenerated]
		public string? DeliveryOTP
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public System.DateTime? OTPGeneratedAt
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public bool OTPVerified
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[Required]
	[MaxLength(32)]
	[field: CompilerGenerated]
		public string Status
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = "Pending";

	[Range(0.0, 1.7976931348623157E+308)]
	[field: CompilerGenerated]
		public decimal TotalAmount
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public System.DateTime? PackedAtUtc
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public System.DateTime? OutForDeliveryAtUtc
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public System.DateTime? DeliveredAtUtc
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[MaxLength(32)]
	[field: CompilerGenerated]
		public string? RejectedBy
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[MaxLength(500)]
	[field: CompilerGenerated]
		public string? RejectionReason
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public System.DateTime? RejectedAtUtc
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public System.DateTime OrderedAtUtc
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = System.DateTime.UtcNow;

	[MaxLength(500)]
	[field: CompilerGenerated]
		public string? ShippingAddress
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public User Customer
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = null;

	[field: CompilerGenerated]
		public User? DeliveryBoy
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public System.Collections.Generic.ICollection<OrderItem> OrderItems
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = (System.Collections.Generic.ICollection<OrderItem>)new List<OrderItem>();
}

