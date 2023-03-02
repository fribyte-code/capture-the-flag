using FluentAssertions;
using friByte.capture_the_flag.service.Models;
using Microsoft.EntityFrameworkCore;

namespace friByte.capture_the_flag.tests
{
    public static class DbCleaner
    {
        private static bool _first = true;

        public static async Task CleanDatabase(CtfContext context)
        {
            if (_first)
            {
                await context.Database.EnsureDeletedAsync();
                context.Migrate();
                _first = false;
            }

            var cleaner = new Cleaner();
            // Add all DbSets to be cleaned below. Order is important due to foreign keys.
            cleaner.Clean(context.SolvedTasks);
            cleaner.Clean(context.CtfTasks);

            var expectedEntityTypes = context.Model.GetEntityTypes()
                .Select(e => e.Name)
                .ToHashSet();
            var actualEntityTypes = cleaner.GetEntityTypes();
            var uncleanedEntityTypes = expectedEntityTypes.Except(actualEntityTypes);

            // Add dbName for databaseModels that are cleaned automatically
            // For example helper tables for Many to Many relations
            uncleanedEntityTypes.Should().BeEquivalentTo(new string[] { });

            await context.SaveChangesAsync();
        }

        private class Cleaner
        {
            private readonly HashSet<string> _cleanedSets = new HashSet<string>();

            public void Clean<T>(DbSet<T> dbSet) where T : class
            {
                dbSet.RemoveRange(dbSet);
                _cleanedSets.Add(typeof(T).FullName!);
            }

            public IEnumerable<string> GetEntityTypes()
            {
                return _cleanedSets;
            }
        }
    }
}
