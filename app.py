from fastapi import FastAPI, Request, File, UploadFile
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from data_scripts import read_data_frame
from io import StringIO

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# BACKEND

@app.post("/send-file")
async def get_file(file: UploadFile = File(...)):
    # Leer el contenido del archivo subido
    contents = await file.read()

    # Convertir a texto (para CSV)
    data = read_data_frame(dataframe=StringIO(contents.decode('utf-8')), typeofdf='csv')

    # Convertir el DataFrame a un diccionario compatible con JSON
    data_sender = {}
    for column in data.columns:
        data_sender[column] = data[column].tolist()

    return {'message': 'success', 'data': data_sender, "name":file.filename}
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