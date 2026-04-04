using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.DTOs;

namespace EcommerceAI.Services;

public interface IOrderService
{
	System.Threading.Tasks.Task<OrderResponseDTO> CheckoutAsync(int userId, CheckoutRequestDTO dto);

	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<OrderResponseDTO>> GetUserOrdersAsync(int userId);

	System.Threading.Tasks.Task<OrderResponseDTO?> GetOrderAsync(int id);

	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<OrderResponseDTO>> GetAllOrdersAsync();

	System.Threading.Tasks.Task AssignDeliveryAsync(int orderId, int deliveryBoyId);

	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<OrderResponseDTO>> GetDeliveryOrdersAsync(int deliveryBoyId);

	System.Threading.Tasks.Task UpdateDeliveryStatusAsync(int deliveryBoyId, int orderId, string status);

	System.Threading.Tasks.Task VerifyDeliveryOtpAsync(int deliveryBoyId, int orderId, string otp);

	System.Threading.Tasks.Task RejectOrderByDeliveryAsync(int deliveryBoyId, int orderId, string reason);

	System.Threading.Tasks.Task RejectOrderByCustomerAsync(int userId, int orderId, string reason);

	System.Threading.Tasks.Task RejectOrderByAdminAsync(int orderId, string reason);
}
