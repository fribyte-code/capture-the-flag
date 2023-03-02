using System.Diagnostics.Eventing.Reader;

namespace friByte.capture_the_flag.service.Services
{
    /// <summary>
    /// The purpose of this service is to check if users are trying to bruteforce the task.
    /// </summary>
    public interface IBruteforceCheckerService
    {
        bool IsWithinBruteforceTimeout(string teamName, Guid taskId);
    }

    /// <summary>
    /// This class needs to inject as a singleton
    /// </summary>
    public class BruteforceCheckerService : IBruteforceCheckerService
    {
        private readonly Dictionary<(string, Guid), DateTime> taskAttemptDict = new Dictionary<(string, Guid), DateTime>();
        public bool IsWithinBruteforceTimeout(string teamName, Guid taskId)
        {
            var hasBeenAttempted = taskAttemptDict.TryGetValue((teamName, taskId), out var lastAttempt);
            taskAttemptDict[(teamName, taskId)] = DateTime.Now;

            if (hasBeenAttempted) {
                return (lastAttempt - DateTime.Now) < TimeSpan.FromMinutes(1);
            } else
            {
                return false;
            }
        }
    }

}
