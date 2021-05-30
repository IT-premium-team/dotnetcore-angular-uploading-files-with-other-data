public interface ISomeService {
    Task SendFeedback(FeedbackDTO feedback);
}

public class SomeService : ISomeService {
    public async Task SendFeedback(FeedbackDTO feedback) {
        // await SEND_FEEDBACK_SOMEWHERE :D
    }
}