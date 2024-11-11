import pickle
import json


def load_params(filename):
    with open(filename, mode="rb") as f:
        state = pickle.load(f)
    w = state["w"]
    with open("w.json", mode="w") as f:
        json.dump(w.tolist(), f)
    b = state["visible_bias"]
    with open("b.json", mode="w") as f:
        json.dump(b.tolist(), f)
    c = state["hidden_bias"]
    with open("c.json", mode="w") as f:
        json.dump(c.tolist(), f)
    print(w[0])
    print(b)
    print(c)


def main():
    load_params("params_test.pkl")


if __name__ == "__main__":
    main()
