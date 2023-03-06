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
        private readonly TimeSpan _bruteForceTimeout = TimeSpan.FromSeconds(30);
        private readonly Dictionary<(string, Guid), DateTime> _taskAttemptDict = new Dictionary<(string, Guid), DateTime>();
        
        public bool IsWithinBruteforceTimeout(string teamName, Guid taskId)
        {
            var hasBeenAttempted = _taskAttemptDict.TryGetValue((teamName, taskId), out var lastAttempt);

            if (hasBeenAttempted && (DateTime.Now - lastAttempt) < _bruteForceTimeout) {
                // Is bruteforce
                return true;
            }
            // Only set last attempt when not bruteforce to avoid setting off yet another timeout period if they attempt again after _bruteForceTimeout - 1s
            _taskAttemptDict[(teamName, taskId)] = DateTime.Now;
            
            return false;
        }
    }

}
