using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace EcommerceAI.Data;

public static class CatalogSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext, ILogger logger, CancellationToken cancellationToken = default)
    {
        if (dbContext.Database.IsMySql())
        {
            await dbContext.Database.EnsureCreatedAsync(cancellationToken);
            await AddColumnIfMissingAsync(dbContext, "RejectedBy", "ALTER TABLE Orders ADD COLUMN RejectedBy varchar(32) NULL;", cancellationToken);
            await AddColumnIfMissingAsync(dbContext, "RejectionReason", "ALTER TABLE Orders ADD COLUMN RejectionReason varchar(500) NULL;", cancellationToken);
            await AddColumnIfMissingAsync(dbContext, "RejectedAtUtc", "ALTER TABLE Orders ADD COLUMN RejectedAtUtc datetime(6) NULL;", cancellationToken);
        }
        else
        {
            await dbContext.Database.MigrateAsync(cancellationToken);
        }
        logger.LogInformation("Database migration completed.");
    }

    private static async Task AddColumnIfMissingAsync(AppDbContext dbContext, string columnName, string alterSql, CancellationToken cancellationToken)
    {
        if (await ColumnExistsAsync(dbContext, columnName, cancellationToken))
        {
            return;
        }

        await dbContext.Database.ExecuteSqlRawAsync(alterSql, cancellationToken);
    }

    private static async Task<bool> ColumnExistsAsync(AppDbContext dbContext, string columnName, CancellationToken cancellationToken)
    {
        var connection = dbContext.Database.GetDbConnection();
        var shouldClose = connection.State != System.Data.ConnectionState.Open;
        if (shouldClose)
        {
            await connection.OpenAsync(cancellationToken);
        }

        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT COUNT(*)
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'Orders'
                  AND COLUMN_NAME = @columnName;";

            var parameter = command.CreateParameter();
            parameter.ParameterName = "@columnName";
            parameter.Value = columnName;
            command.Parameters.Add(parameter);

            var result = await command.ExecuteScalarAsync(cancellationToken);
            var count = result is null ? 0 : System.Convert.ToInt32(result);
            return count > 0;
        }
        finally
        {
            if (shouldClose)
            {
                await connection.CloseAsync();
            }
        }
    }
}
