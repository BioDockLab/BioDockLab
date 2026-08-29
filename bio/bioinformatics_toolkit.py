"""
BioDockLab bioinformatics toolkit scaffold.

Planned stack:
- Biopython: sequence parsing
- RDKit: molecular structure analysis
"""

try:
    from Bio.Seq import Seq
except ImportError:
    Seq = None

try:
    from rdkit import Chem
except ImportError:
    Chem = None


def summarize_sequence(sequence: str):
    if Seq is None:
      return {
          "sequence": sequence,
          "length": len(sequence),
          "status": "Biopython not installed"
      }

    seq = Seq(sequence)
    return {
        "sequence": str(seq),
        "length": len(seq),
        "reverse_complement": str(seq.reverse_complement())
    }


def parse_smiles(smiles: str):
    if Chem is None:
        return {
            "smiles": smiles,
            "status": "RDKit not installed"
        }

    molecule = Chem.MolFromSmiles(smiles)
    return {
        "smiles": smiles,
        "valid": molecule is not None
    }