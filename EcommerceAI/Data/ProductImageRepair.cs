using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace EcommerceAI.Data;

public static class ProductImageRepair
{
    public static Task<int> RepairAsync(AppDbContext dbContext, ILogger logger, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Product image repair skipped.");
        return Task.FromResult(0);
    }
}
