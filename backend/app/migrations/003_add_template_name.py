"""Add template_name column to invoices table."""

async def upgrade(db):
    """Add template_name column."""
    await db.execute("""
        ALTER TABLE invoices 
        ADD COLUMN template_name VARCHAR(100) DEFAULT 'invoice_template.html'
    """)


async def downgrade(db):
    """Remove template_name column."""
    await db.execute("""
        ALTER TABLE invoices 
        DROP COLUMN template_name
    """)
