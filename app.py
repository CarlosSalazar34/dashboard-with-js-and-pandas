from fastapi import FastAPI, Request, File, UploadFile
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from data_scripts import read_data_frame

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# BACKEND

@app.post("/send-file")
async def get_file(file: UploadFile = File(...)):
    # contents = await file.read()
    data = read_data_frame(file.filename, typeofdf="csv")

    data_sender = {}


    for column in data.columns:
        print(column)
        data_sender[column] = data[column]

    return {'message': 'success', 'data': data_sender}

    # print(len(contents))
    # return {
    #     "filename": file.filename,
    #     "size": len(contents),
    #     "content_type": file.content_type
    # }

# ROUTES OF PAGES

async def main(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

app.add_api_route("/", main, methods=["GET", "POST"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="app:app", host="127.0.0.1", port=8000, reload=True)