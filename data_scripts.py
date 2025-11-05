import pandas as pd

def read_data_frame(dataframe, typeofdf: str)->list:
    if typeofdf == "csv":
        df = pd.read_csv(dataframe)
        description = df.describe()
        dimentions = df.shape

    if typeofdf == "xlsx":
        df = pd.read_excel(dataframe)
        description = df.describe()
        dimentions = df.shape

    return [df, description, dimentions]


