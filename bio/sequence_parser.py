def parse_fasta(text: str):
    records = []
    current_id = None
    sequence = []

    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue

        if line.startswith(">"):
            if current_id:
                records.append({
                    "id": current_id,
                    "sequence": "".join(sequence)
                })
            current_id = line[1:]
            sequence = []
        else:
            sequence.append(line)

    if current_id:
        records.append({
            "id": current_id,
            "sequence": "".join(sequence)
        })

    return records


if __name__ == "__main__":
    sample = """>protein_sample_001
MKTAYIAKQRQISFVKSHFSRQDILDLWQ
"""
    print(parse_fasta(sample))