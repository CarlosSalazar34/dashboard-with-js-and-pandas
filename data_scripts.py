import pandas as pd

def read_data_frame(dataframe, typeofdf: str):
    if typeofdf == "csv":
        df = pd.read_csv(dataframe)
    return df