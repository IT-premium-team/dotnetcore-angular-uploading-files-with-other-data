public class SomeController {
    private readonly ISomeService _someService;

    public SomeController(ISomeService someService) {
        _someService = someService;
    }

    [HttpPost("feedback")]
    public async Task<OperationResponse> SendFeedback()
    {
        var files = Request.Form.Files;
        var email = Request.Form["email"];
        var message = Request.Form["message"];

        var processedFiles = new List<FileDataDTO>();
        if (files.Count > 0)
        {
            foreach (var fileStream in files)
            {
                processedFiles.Add(new FileDataDTO()
                {
                    Filename = fileStream.FileName,
                    Data = LoadData(fileStream.OpenReadStream())
                });
            }
        }

        var model = new FeedbackDTO()
        {
            Email = email,
            Message = message,
            Files = processedFiles
        };

        return await _someService.SendFeedback(model);
    }

    private byte[] LoadData(Stream fileStaream)
    {
        byte[] result = new byte[] { };

        using (var stream = new MemoryStream())
        {
            // read file stream
            byte[] buffer = new byte[2048]; // read in chunks of 2KB
            int bytesRead;
            while ((bytesRead = fileStaream.Read(buffer, 0, buffer.Length)) > 0)
            {
                stream.Write(buffer, 0, bytesRead);
            }

            result = stream.ToArray();
        }

        return result;
    }

}