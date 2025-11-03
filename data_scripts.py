import pandas as pd

def read_data_frame(dataframe, typeofdf):
    if typeofdf == "csv":
        df = pd.read_csv(dataframe)
    return df