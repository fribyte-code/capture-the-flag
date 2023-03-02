using friByte.capture_the_flag.service.Models;
using Microsoft.EntityFrameworkCore;

namespace friByte.capture_the_flag.tests
{
    public static class DbTestHelper
    {
        public static DbContextOptions<CtfContext> GetDbContextOptionsBuilder()
        {
            return GetDbContextOptionsBuilder(new DbContextOptionsBuilder<CtfContext>()).Options;
        }

        private static DbContextOptionsBuilder<CtfContext> GetDbContextOptionsBuilder(DbContextOptionsBuilder<CtfContext> options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            var host = GetPostgresHost();
            return options.UseNpgsql($"Host={host};Database=ctf-test;Username=postgres;Password=postgres;IncludeErrorDetails=true")
                .EnableSensitiveDataLogging();
        }

        /// <summary>
        /// Running the tests in docker requires usage of container name hostname instead of localhost
        /// </summary>
        /// <returns></returns>
        private static string GetPostgresHost()
        {
            var host = "localhost";
            if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true")
            {
                host = "postgres";
            }

            var dockerComposeHost = Environment.GetEnvironmentVariable("DOCKER_COMPOSE_HOST_IP");
            if (!string.IsNullOrEmpty(dockerComposeHost))
            {
                host = dockerComposeHost;
            }

            return host;
        }
    }
}
