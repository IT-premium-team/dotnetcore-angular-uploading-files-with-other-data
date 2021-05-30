public class FeedbackDTO {
    public string Email { get; set; }
    public string Message { get; set; }
    public IEnumerable<FileDataDTO> Files { get; set; }
}