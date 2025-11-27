#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script para verificar que todos los módulos se importan correctamente
"""

import sys
print("🔍 Verificando importaciones...")

try:
    print("✓ Importando flask...")
    from flask import Flask, request, jsonify
    print("✓ Flask importado correctamente")
except Exception as e:
    print(f"✗ Error con flask: {e}")
    sys.exit(1)

try:
    print("✓ Importando dotenv...")
    from dotenv import load_dotenv
    print("✓ dotenv importado correctamente")
except Exception as e:
    print(f"✗ Error con dotenv: {e}")
    sys.exit(1)

try:
    print("✓ Importando openai...")
    import openai
    print("✓ OpenAI importado correctamente")
except Exception as e:
    print(f"✗ Error con openai: {e}")
    sys.exit(1)

try:
    print("✓ Importando psycopg2...")
    import psycopg2
    print("✓ psycopg2 importado correctamente")
except Exception as e:
    print(f"✗ Error con psycopg2: {e}")
    sys.exit(1)

try:
    print("✓ Importando pandas...")
    import pandas as pd
    print("✓ pandas importado correctamente")
except Exception as e:
    print(f"✗ Error con pandas: {e}")
    sys.exit(1)

try:
    print("✓ Importando reportlab...")
    from reportlab.lib import colors
    print("✓ reportlab importado correctamente")
except Exception as e:
    print(f"✗ Error con reportlab: {e}")
    sys.exit(1)

try:
    print("✓ Importando openpyxl...")
    import openpyxl
    print("✓ openpyxl importado correctamente")
except Exception as e:
    print(f"✗ Error con openpyxl: {e}")
    sys.exit(1)

print("\n✅ ¡Todas las dependencias se importaron correctamente!")
print("🚀 Puedes ejecutar: python main.py")
