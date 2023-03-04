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
    /// This class needs to be injected as a singleton
    /// </summary>
    public class BruteforceCheckerService : IBruteforceCheckerService
    {
        private readonly TimeSpan _bruteForceTimeout = TimeSpan.FromMinutes(1);
        private readonly Dictionary<(string, Guid), DateTime> _taskAttemptDict = new Dictionary<(string, Guid), DateTime>();
        
        public bool IsWithinBruteforceTimeout(string teamName, Guid taskId)
        {
            var hasBeenAttempted = _taskAttemptDict.TryGetValue((teamName, taskId), out var lastAttempt);
            _taskAttemptDict[(teamName, taskId)] = DateTime.Now;

            if (hasBeenAttempted) {
                return (lastAttempt - DateTime.Now) < _bruteForceTimeout;
            }
            
            return false;
        }
    }

}
