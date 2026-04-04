using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class AssignDeliveryDTO
{
	[Range(1, 2147483647)]
	[field: CompilerGenerated]
		public int DeliveryBoyId
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}
}

