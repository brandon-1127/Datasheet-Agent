##Data-sheet agent

## Key issues

1. Text extraction versus native PDF

Text extraction:
Pros: Text extraction is fast and cheap. Saves on tokens and API Costs. 
Cons: Completely skips images and can scramble information when parsing.

Native PDF:
Pros: Extreme accuracy
Cons: Expensive AF!

Overall, uploading the raw PDF fle to a multimodal agent returns us the best information on our hardware components. Since providing precise information is the most important part of this tool, the Native PDF route might be the best option.